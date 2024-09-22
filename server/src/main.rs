use actix_cors::Cors;
use actix_web::{get, App, HttpResponse, HttpServer, Responder};

const CSV_FILE_PATH: &'static str = "/home/froot/Downloads/PS_2024.09.21_08.50.23.csv";

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        let cors = Cors::default().allow_any_origin(); 

        App::new()
            .wrap(cors)
            .service(get)
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}

#[get("/")]
async fn get() -> impl Responder {
    HttpResponse::Ok().json(
        server::utils::read_exoplanet_records(CSV_FILE_PATH, 100)
    )
} 