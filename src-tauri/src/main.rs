// Hide the console window on Windows release builds.
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use cosmossi_core::calendar::{self, CalendarDate, DayInfo, MonthLayout};
use cosmossi_core::geo;
use cosmossi_core::measure::{self, AreaMeasure, LonLat, PathMeasure};
use cosmossi_core::project::Project;
use cosmossi_core::projection::{Projection, DEG};
use cosmossi_core::timeline::{self, Timeline};
use cosmossi_core::units::{format_length, LengthUnit};
use serde::Serialize;

#[derive(Serialize)]
struct ProjectionInfo {
    id: &'static str,
    name: &'static str,
    tag: &'static str,
    globe: bool,
    xmax: f64,
    ymax: f64,
}

/// The projections the Rust core knows. The front end cross-checks this list on start-up.
#[tauri::command]
fn list_projections() -> Vec<ProjectionInfo> {
    Projection::ALL
        .iter()
        .map(|p| {
            let (xmax, ymax) = p.half_extent();
            ProjectionInfo { id: p.id(), name: p.name(), tag: p.tag(), globe: p.is_globe(), xmax, ymax }
        })
        .collect()
}

/// lon/lat in degrees -> projected (x, y) on the unit sphere; `None` if not visible.
/// From JS: invoke('project_point', { id, lonDeg, latDeg, lon0Deg, lat0Deg })
#[tauri::command]
fn project_point(id: String, lon_deg: f64, lat_deg: f64, lon0_deg: f64, lat0_deg: f64) -> Result<Option<(f64, f64)>, String> {
    let p = Projection::from_id(&id).ok_or_else(|| format!("unknown projection '{id}'"))?;
    Ok(p.project(lon_deg * DEG, lat_deg * DEG, lon0_deg * DEG, lat0_deg * DEG))
}

/// projected (x, y) -> lon/lat in degrees; `None` if outside the outline.
#[tauri::command]
fn unproject_point(id: String, x: f64, y: f64, lon0_deg: f64, lat0_deg: f64) -> Result<Option<(f64, f64)>, String> {
    let p = Projection::from_id(&id).ok_or_else(|| format!("unknown projection '{id}'"))?;
    Ok(p.unproject(x, y, lon0_deg * DEG, lat0_deg * DEG).map(|(lo, la)| (lo / DEG, la / DEG)))
}

/// Great-circle distance between two lon/lat points (degrees) on a planet of `radius_km`, in kilometres.
#[tauri::command]
fn great_circle_km(lon1_deg: f64, lat1_deg: f64, lon2_deg: f64, lat2_deg: f64, radius_km: f64) -> f64 {
    geo::great_circle_km(lon1_deg * DEG, lat1_deg * DEG, lon2_deg * DEG, lat2_deg * DEG, radius_km)
}

/// Format a length in Cosmossi `whole.fraction` notation (or plain decimals for real units).
#[tauri::command]
fn format_distance(value: f64, unit_key: String) -> Result<String, String> {
    let unit = LengthUnit::from_key(&unit_key).ok_or_else(|| format!("unknown unit '{unit_key}'"))?;
    Ok(format_length(value, unit))
}

/// Validate and write a project file. The front end never writes files itself.
#[tauri::command]
fn save_project(path: String, json: String) -> Result<(), String> {
    let project = Project::from_json(&json)?;
    let text = project.to_json_pretty()?;
    std::fs::write(&path, text).map_err(|e| format!("could not write {path}: {e}"))
}

/// Write the bytes of an exported image. The front end sends the raw PNG as the request body and the
/// destination (chosen in the native save dialog) percent-encoded in a `path` header. Only `.png` files are written.
#[tauri::command]
fn save_binary(request: tauri::ipc::Request<'_>) -> Result<(), String> {
    let tauri::ipc::InvokeBody::Raw(data) = request.body() else {
        return Err("expected raw image bytes".into());
    };
    let raw = request.headers().get("path").and_then(|v| v.to_str().ok()).ok_or("missing destination path")?;
    let path = percent_decode(raw)?;
    if !path.to_ascii_lowercase().ends_with(".png") {
        return Err("only .png files can be exported".into());
    }
    std::fs::write(&path, data).map_err(|e| format!("could not write {path}: {e}"))
}

fn percent_decode(s: &str) -> Result<String, String> {
    let b = s.as_bytes();
    let mut out = Vec::with_capacity(b.len());
    let mut i = 0;
    while i < b.len() {
        if b[i] == b'%' {
            if i + 2 >= b.len() {
                return Err("bad path encoding".into());
            }
            let hex = std::str::from_utf8(&b[i + 1..i + 3]).map_err(|_| "bad path encoding")?;
            out.push(u8::from_str_radix(hex, 16).map_err(|_| "bad path encoding")?);
            i += 3;
        } else {
            out.push(b[i]);
            i += 1;
        }
    }
    String::from_utf8(out).map_err(|_| "bad path encoding".to_string())
}

/// Read, validate and normalise a project file; returns canonical JSON for the editor.
#[tauri::command]
fn load_project(path: String) -> Result<String, String> {
    let text = std::fs::read_to_string(&path).map_err(|e| format!("could not read {path}: {e}"))?;
    Project::from_json(&text)?.to_json_pretty()
}

// ---------------------------------------------------------------------------------------------------------
// Calendar (Batch 5.1). Day numbers: 1 = 1 Çuanede, year 0, era 1. Months are 1-based. All of these return
// Err(String) with a human-readable message for dates that do not exist; the front end shows it as-is.
// ---------------------------------------------------------------------------------------------------------

#[derive(Serialize)]
struct NamedLength {
    name: &'static str,
    days: u8,
}

#[derive(Serialize)]
struct Weekday {
    name: &'static str,
    icon: &'static str,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct CalendarInfo {
    months: Vec<NamedLength>,
    weekdays: Vec<Weekday>,
    era_names: Vec<&'static str>,
    years_per_era: i64,
    leap_interval_years: i64,
    days_per_week: i64,
    base_year_length: i64,
    max_era: u32,
    anchor_date: CalendarDate,
    anchor_gregorian: (i64, u8, u8),
    anchor_day_number: i64,
    max_day_number: i64,
}

/// Static description of the calendar (month/weekday/era names and constants). The front end cross-checks it
/// against `web/js/calendar.js` on start-up in a later sub-batch.
#[tauri::command]
fn calendar_info() -> CalendarInfo {
    CalendarInfo {
        months: calendar::MONTHS.iter().map(|m| NamedLength { name: m.name, days: m.days }).collect(),
        weekdays: calendar::WEEKDAYS.iter().map(|w| Weekday { name: w.name, icon: w.icon }).collect(),
        era_names: calendar::ERA_NAMES.to_vec(),
        years_per_era: calendar::YEARS_PER_ERA,
        leap_interval_years: calendar::LEAP_INTERVAL_YEARS,
        days_per_week: calendar::DAYS_PER_WEEK,
        base_year_length: calendar::BASE_YEAR_LENGTH,
        max_era: calendar::MAX_ERA,
        anchor_date: calendar::ANCHOR_DATE,
        anchor_gregorian: calendar::ANCHOR_GREGORIAN,
        anchor_day_number: calendar::anchor_day_number(),
        max_day_number: calendar::max_day_number(),
    }
}

/// Everything about one day (date, code, long form, weekday, Gregorian equivalent...).
/// From JS: invoke('calendar_day_info', { dayNumber })
#[tauri::command]
fn calendar_day_info(day_number: i64) -> Result<DayInfo, String> {
    calendar::day_info(day_number).map_err(|e| e.to_string())
}

/// From JS: invoke('calendar_to_day_number', { era, year, month, day })
#[tauri::command]
fn calendar_to_day_number(era: u32, year: u32, month: u8, day: u8) -> Result<i64, String> {
    CalendarDate::new(era, year, month, day).and_then(|d| d.day_number()).map_err(|e| e.to_string())
}

/// From JS: invoke('calendar_from_day_number', { dayNumber })
#[tauri::command]
fn calendar_from_day_number(day_number: i64) -> Result<CalendarDate, String> {
    CalendarDate::from_day_number(day_number).map_err(|e| e.to_string())
}

/// Parse `DD/MM/YYY-EE` into a validated date.
#[tauri::command]
fn calendar_parse_code(code: String) -> Result<CalendarDate, String> {
    CalendarDate::parse_code(&code).map_err(|e| e.to_string())
}

/// Proleptic Gregorian (UTC) date -> day number.
#[tauri::command]
fn calendar_gregorian_to_day_number(year: i64, month: u8, day: u8) -> Result<i64, String> {
    calendar::gregorian_to_day_number(year, month, day).map_err(|e| e.to_string())
}

/// Day number -> Gregorian (year, month, day).
#[tauri::command]
fn calendar_day_number_to_gregorian(day_number: i64) -> Result<(i64, u8, u8), String> {
    calendar::day_number_to_gregorian(day_number).map_err(|e| e.to_string())
}

/// Move a date by days. From JS: invoke('calendar_add_days', { date: {era, year, month, day}, delta })
#[tauri::command]
fn calendar_add_days(date: CalendarDate, delta: i64) -> Result<CalendarDate, String> {
    date.add_days(delta).map_err(|e| e.to_string())
}

/// Move a date by whole months (day clamped to the target month's length).
#[tauri::command]
fn calendar_add_months(date: CalendarDate, delta: i64) -> Result<CalendarDate, String> {
    date.add_months(delta).map_err(|e| e.to_string())
}

/// Grid layout of one month: length, leading blank cells, leap flag, first day number.
#[tauri::command]
fn calendar_month_layout(era: u32, year: u32, month: u8) -> Result<MonthLayout, String> {
    calendar::month_layout(era, year, month).map_err(|e| e.to_string())
}

/// Today's day number, from the system clock (UTC day, same convention as the original calendar page).
#[tauri::command]
fn calendar_today() -> Result<i64, String> {
    let secs = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .map_err(|e| format!("system clock is before 1970: {e}"))?
        .as_secs() as i64;
    calendar::day_number_from_unix_secs(secs).map_err(|e| e.to_string())
}

/// A fresh timeline (range = era 1..end of era 6, current day = calendar anchor).
#[tauri::command]
fn timeline_default() -> Timeline {
    Timeline::new()
}

/// Validate a timeline; pass the project to also check event links and feature lifespans.
/// From JS: invoke('timeline_validate', { timeline, project })  (project may be null)
#[tauri::command]
fn timeline_validate(timeline: Timeline, project: Option<Project>) -> Result<(), String> {
    match project {
        Some(p) => timeline.validate_against(&p),
        None => timeline.validate(),
    }
}

/// Ids of the features that exist on a day. (The slider itself uses web/js/timeline.js for speed.)
#[tauri::command]
fn timeline_visible_ids(project: Project, day: i64) -> Vec<String> {
    timeline::visible_feature_ids(&project, day)
}

/// [earliest, latest] day mentioned by any feature lifespan, or null.
#[tauri::command]
fn timeline_life_extent(project: Project) -> Option<(i64, i64)> {
    timeline::life_extent(&project)
}

// ---------------------------------------------------------------------------------------------------------
// Geodesic measurement (Batch 6.1). Points are [lon, lat] in degrees; the planet is a sphere of `radius_km`.
// ---------------------------------------------------------------------------------------------------------

/// Length and bearings of a path of great-circle legs. From JS: invoke('measure_path', { points, radiusKm })
#[tauri::command]
fn measure_path(points: Vec<LonLat>, radius_km: f64) -> Result<PathMeasure, String> {
    measure::measure_path(&points, radius_km)
}

/// Point reached by travelling `distance_km` from `from` on `bearing_deg`.
#[tauri::command]
fn measure_destination(from: LonLat, bearing_deg: f64, distance_km: f64, radius_km: f64) -> Result<LonLat, String> {
    if !(radius_km.is_finite() && radius_km > 0.0 && bearing_deg.is_finite() && distance_km.is_finite()) {
        return Err("radius must be positive and bearing/distance must be numbers".into());
    }
    Ok(measure::destination(from, bearing_deg, distance_km, radius_km))
}

/// Points along the great-circle arc between two points (for drawing or export).
#[tauri::command]
fn measure_arc(from: LonLat, to: LonLat, step_deg: f64) -> Result<Vec<LonLat>, String> {
    if !(step_deg.is_finite() && step_deg >= 0.01) {
        return Err("step must be at least 0.01 degrees".into());
    }
    Ok(measure::arc_points(from, to, step_deg))
}

/// Area, perimeter and self-intersection check of the polygon through `points` (closing edge implicit; Batch 6.2).
/// From JS: invoke('measure_area', { points, radiusKm })
#[tauri::command]
fn measure_area(points: Vec<LonLat>, radius_km: f64) -> Result<AreaMeasure, String> {
    measure::measure_area(&points, radius_km)
}

/// Path of the `.cosmap` file the app was launched with (double-click in Explorer / "Open with"), if any (Batch 6.4).
/// From JS: invoke('startup_file') -> string | null
#[tauri::command]
fn startup_file() -> Option<String> {
    cosmossi_core::startup::project_arg(std::env::args_os()).filter(|p| p.is_file()).map(|p| p.to_string_lossy().into_owned())
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![list_projections, project_point, unproject_point, great_circle_km, format_distance, save_project, save_binary, load_project,
            calendar_info, calendar_day_info, calendar_to_day_number, calendar_from_day_number, calendar_parse_code,
            calendar_gregorian_to_day_number, calendar_day_number_to_gregorian, calendar_add_days, calendar_add_months,
            calendar_month_layout, calendar_today,
            timeline_default, timeline_validate, timeline_visible_ids, timeline_life_extent,
            measure_path, measure_destination, measure_arc, measure_area, startup_file])
        .run(tauri::generate_context!())
        .expect("error while running Cosmossi Atlas");
}
