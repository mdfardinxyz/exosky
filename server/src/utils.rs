use std::fs;
use crate::records::*;

pub fn read_exoplanet_records(path: &'static str, n: usize) -> Vec<ExoplanetRecord> {
    let indices = RecordIndices::new(1, 82, 84, 92);

    fs::read_to_string(path)
        .expect("expected a valid file path!")
        .lines()
        .skip(125)
        .take(n)
        .map(|line| ExoplanetRecord::from_csv(line, &indices))
        .filter(Result::is_ok)
        .map(Result::unwrap)
        .collect()
}
