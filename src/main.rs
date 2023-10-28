use std::env;
use serde::{Serialize, Deserialize};
use mongodb::{bson::doc, Client, options::ClientOptions, Database};
use actix_web::{get, web, App, HttpResponse, HttpServer, HttpRequest};
use actix_cors::Cors;
use actix_files::NamedFile;
use futures::stream::TryStreamExt;
//use argon2::{Argon2, password_hash::{rand_core::OsRng, PasswordHash, PasswordHasher, PasswordVerifier, SaltString}};
//use jsonwebtoken::{EncodingKey, DecodingKey, Validation};
//use actix_web_httpauth::headers::authorization::{Authorization, Bearer};

//mod hrid;

#[derive(Serialize, Deserialize, Debug)]
struct WordData {
    x: u8,
    y: u8,
    length: u8,
    clue: String,
}

#[derive(Serialize, Deserialize, Debug)]
struct Clues {
    horizontal: Vec<WordData>,
    vertical: Vec<WordData>,
}

#[derive(Serialize, Deserialize, Debug)]
struct PuzzleData {
    title: String,
    user: String,
    width: u8,
    height: u8,
    solution: Vec<String>,
    clues: Clues,
    published: Option<bool>,
}

#[derive(Serialize, Deserialize, Debug)]
struct UserClaims {
    exp: usize,
    user: String,
}

#[derive(Serialize, Deserialize, Debug)]
struct FullUser {
    username: String,
    pw: String,
    salt: String,
}

#[derive(Serialize, Deserialize, Debug)]
struct User {
    username: String,
    pw: String,
}

#[derive(Debug)]
struct ServerData {
    db: Database,
    root_dir: String,
    //jwt_secret: String,
    //pepper: String,
}

async fn set_up_db(uri: &str) -> Result<Client, mongodb::error::Error> {
    let client_options = ClientOptions::parse(uri).await?;
    let client = Client::with_options(client_options)?;
    Ok(client)
}

async fn get_puzzle(id: String, db: &Database) -> Result<Option<PuzzleData>, Box<dyn std::error::Error>> {
    let collection = db.collection::<PuzzleData>("puzzles");
    let mut data = collection.find(doc! {
        "_id": id,
    }, None).await?;
    let puzzle = data.try_next().await?;
    Ok(puzzle)
}

/* async fn get_puzzles_by_user(userid: String, db: &Database) -> Result<Vec<PuzzleData>, Box<dyn std::error::Error>> {
    let collection = db.collection::<PuzzleData>("puzzles");
    let data = collection.find(doc! {
        "user": userid,
    }, None).await?;
    let res: Vec<PuzzleData> = data.try_collect().await?;
    Ok(res)
}

async fn get_user_by_username(user: &User, db: &Database) -> Result<Option<FullUser>, Box<dyn std::error::Error>> {
    let mut cursor = db.collection("users").find(doc! {
        "username": user.username.clone()
    }, None).await?;
    let full_user = cursor.try_next().await?;
    Ok(full_user)
}

fn determine_token_user(token: web::Header<Authorization<Bearer>>, key: &str) -> Option<String> {
    let token = token.into_inner();
    let token = token.into_scheme();
    let token = token.token();
    println!("{}", token);
    match jsonwebtoken::decode::<UserClaims>(token, &DecodingKey::from_secret(key.as_ref()), &Validation::default()) {
        Ok(claims) => Some(claims.claims.user),
        Err(_) => None,
    }
}

fn can_user_access_puzzle(user: &Option<String>, puzzle: &PuzzleData) -> bool {
    if puzzle.published == Some(true) {
        return true;
    }
    if let Some(u) = user {
        if u == &puzzle.user {
            return true;
        }
    }
    false
} */

#[get("api/puzzle/{id}")]
async fn service_get_puzzle(id: web::Path<String>, data: web::Data<ServerData>) -> HttpResponse {
    match get_puzzle(id.into_inner(), &data.db).await {
        Ok(res) => match res {
            Some(puzzle) => HttpResponse::Ok().json(puzzle),
            None => HttpResponse::NotFound().body("puzzle not found"),
        },
        Err(e) => {
            println!("{:?}", e);
            HttpResponse::InternalServerError().body("internal server error")
        },
    }   
}

/* #[get("api/puzzlesby/{userid}")]
async fn service_get_puzzles_by_user(userid: web::Path<String>, data: web::Data<ServerData>, token: Option<web::Header<Authorization<Bearer>>>) -> HttpResponse {
    let puzzles = get_puzzles_by_user(userid.into_inner(), &data.db).await;
    if let Err(e) = puzzles {
        println!("{:?}", e);
        return HttpResponse::InternalServerError().body("internal server error")
    }
    let user = match token {
        Some(t) => determine_token_user(t, &data.jwt_secret),
        None => None,
    };
    let puzzles = puzzles.unwrap();
    let puzzles: Vec<&PuzzleData> = puzzles.iter().filter(move |p| {
        can_user_access_puzzle(&user, p)
    }).collect();
    HttpResponse::Ok().json(puzzles)
}

#[post("api/register")]
async fn service_post_register(data: web::Data<ServerData>, user: web::Json<User>) -> HttpResponse {
    let salt = hrid::get_hrid();
    let user = user.into_inner();
    let hash = format!("{}{}{}", salt, user.username, data.pepper);
    let argon_salt = SaltString::generate(&mut OsRng);
    let hash = Argon2::default().hash_password(hash.as_bytes(), &argon_salt).unwrap().to_string();
    let db_user = FullUser {
        username: user.username,
        pw: hash,
        salt,
    };
    match data.db.collection("users").insert_one(db_user, None).await {
        Ok(_) => HttpResponse::Ok().body("user created successfully"),
        Err(e) => {
            println!("{:?}", e);
            HttpResponse::InternalServerError().body("error writing into database")
        }
    }
}

#[post("api/login")]
async fn service_post_login(data: web::Data<ServerData>, user: web::Json<User>) -> HttpResponse {
    let user = user.into_inner();
    let full_user = get_user_by_username(&user, &data.db).await;
    if full_user.is_err() {
        return HttpResponse::InternalServerError().body("error reading database");
    }
    let full_user = full_user.unwrap();
    if full_user.is_none() {
        return HttpResponse::Forbidden().body("wrong username or password");
    }
    let full_user = full_user.unwrap();
    let full_pw = format!("{}{}{}", full_user.salt, user.pw, data.pepper);
    let hash = PasswordHash::new(full_user.pw.as_str());
    if hash.is_err() {
        return HttpResponse::InternalServerError().body("malformed database entry");
    }
    let hash = hash.unwrap();
    match Argon2::default().verify_password(full_pw.as_bytes(), &hash) {
        Ok(_) => {
            let token = jsonwebtoken::encode(&jsonwebtoken::Header::default(), &UserClaims {
                user: user.username,
                exp: 60_000_000,
            }, &EncodingKey::from_secret(data.jwt_secret.as_ref())).unwrap();
            HttpResponse::Ok().body(token)
        },
        Err(e) => {
            println!("{:?}", e);
            HttpResponse::Forbidden().body("wrong username or password")
        }
    }
} */

#[get("editor")]
async fn page_editor(req: HttpRequest, data: web::Data<ServerData>) -> HttpResponse {
    let path = format!("{}/html/editor.html", data.root_dir);
    let file = NamedFile::open_async(&path).await;
    match file {
        Ok(f) => f.into_response(&req),
        Err(_) => HttpResponse::InternalServerError().body("error reading file"),
    }
}

#[get("puzzle/{id}")]
async fn page_puzzle(req: HttpRequest, data: web::Data<ServerData>) -> HttpResponse {
    let path = format!("{}/html/puzzle.html", data.root_dir);
    println!("{}", path);
    let file = NamedFile::open_async(path).await;
    match file {
        Ok(f) => f.into_response(&req),
        Err(_) => HttpResponse::InternalServerError().body("error reading file"),
    }
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {

    let uri = env::var("MONGO_URI").unwrap_or(String::from("mongodb://localhost:27017"));
    let client = set_up_db(uri.as_str()).await.expect("Should be able to connect do Mongo DB");
    let db = client.database(env::var("DATABASE").unwrap_or(String::from("crossword")).as_str());
    let port: u16 = env::var("PORT").unwrap_or(String::from("3000")).parse().unwrap_or(3000);
    let root_dir: String = env::var("ROOT_DIR").unwrap_or(String::from("."));
    println!("{}", root_dir);
    //let jwt_secret = env::var("JWT_SECRET").unwrap_or(String::from("supersecret"));
    //let pepper = env::var("PEPPER").unwrap_or(String::from("pepper"));

    HttpServer::new(move || {
        let cors = Cors::permissive();
        App::new()
            .wrap(cors)
            .app_data(web::Data::new(ServerData {
                db: db.clone(),
                root_dir: root_dir.clone(),
                //jwt_secret: jwt_secret.clone(),
                //pepper: pepper.clone(),
            }))
            .service(page_puzzle)
            .service(page_editor)
            .service(service_get_puzzle)
            //.service(service_get_puzzles_by_user)
            //.service(service_post_register)
            //.service(service_post_login)
            .service(actix_files::Files::new("/", format!("{}/static", root_dir)))
    })
    .bind(("0.0.0.0", port))?
    .run()
    .await

}