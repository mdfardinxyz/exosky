use std::error::Error;

use serde::{Deserialize, Serialize};

pub struct RecordIndices {
    name: usize,
    ra_deg: usize,
    dec_deg: usize,
    dp: usize,
}

impl RecordIndices {
    pub fn new(name: usize, ra_deg: usize, dec_deg: usize, dp: usize) -> Self {
        Self {
            name,
            ra_deg,
            dec_deg,
            dp,
        }
    }
}

#[derive(Serialize, Deserialize, Debug, Default)]
pub struct ExoplanetRecord {
    name: String,
    xp: f32,
    yp: f32,
    zp: f32,
    dp: f32,
}

impl ExoplanetRecord {
    pub fn from_csv(line: &str, indices: &RecordIndices) -> Result<Self, Box<dyn Error>> {
        let values = line.split(",").collect::<Vec<&str>>();

        let ra_rad = values[indices.ra_deg].parse::<f32>()?.to_radians();
        let dec_rad = values[indices.dec_deg].parse::<f32>()?.to_radians();
        let dp = values[indices.dp].parse::<f32>()?;

        let xp = dp * dec_rad.cos() * ra_rad.cos();
        let yp = dp * dec_rad.cos() * ra_rad.sin();
        let zp = dp * dec_rad.sin();

        Ok(Self {
            name: String::from(values[indices.name]),
            xp,
            yp,
            zp,
            dp,
        })
    }
}
