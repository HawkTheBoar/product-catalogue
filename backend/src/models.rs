use serde::{Deserialize, Serialize};
use sqlx::prelude::FromRow;

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct Category {
    pub id: i64,
    pub name: String,
    pub description: Option<String>,
    pub parent_id: Option<i64>,
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct Product {
    pub id: i64,
    pub name: String,
    pub description: Option<String>,
    pub price: i64,
    pub category_id: Option<i64>,
    // pub created_at: NaiveDateTime,
    // pub updated_at: NaiveDateTime,
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct ProductCategory {
    pub product_id: i64,
    pub category_id: i64,
}
#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct Admin {
    pub id: i64,
    pub password: String,
    pub username: String,
}
#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct SubCategory {
    pub id: Option<i64>,
    pub name: String,
    pub description: Option<String>,
    pub parent_id: Option<i64>, // guaranteed by WHERE parent_id = ?
}
// impl TryInto<Category> for SubCategory {
//     type Error = std::io::Error;
//     fn try_into(self) -> Result<Category, Self::Error> {
//         if let Some(id) = self.id {
//             Ok(Category {
//                 id,
//                 name: self.name,
//                 description: self.description,
//                 parent_id: self.parent_id,
//             })
//         } else {
//             Err(std::io::Error::new(
//                 std::io::ErrorKind::InvalidInput,
//                 "Couldnt convert subcategory into category".to_string(),
//             ))
//         }
//     }
// }
impl TryFrom<&SubCategory> for Category {
    type Error = &'static str;
    fn try_from(value: &SubCategory) -> Result<Self, Self::Error> {
        if let Some(id) = value.id {
            Ok(Category {
                id,
                name: value.name.clone(),
                description: value.description.clone(),
                parent_id: value.parent_id,
            })
        } else {
            Err("Couldnt convert subcategory into category")
        }
    }
}
pub struct Token {
    pub token: String,
    pub admin_id: String,
    // pub created_at
}
pub mod request {
    pub mod delete {
        use serde::{Deserialize, Serialize};
        #[derive(Debug, Serialize, Deserialize)]
        pub struct Product {
            pub product_id: i64,
        }
        #[derive(Debug, Serialize, Deserialize)]
        pub struct Category {
            pub category_id: i64,
        }
    }
    pub mod create {
        use serde::{Deserialize, Serialize};

        #[derive(Debug, Serialize, Deserialize)]
        pub struct Product {
            pub name: String,
            pub description: Option<String>,
            pub price: i64,
            pub category_id: Option<i64>,
        }
        #[derive(Debug, Serialize, Deserialize)]
        pub struct Category {
            pub name: String,
            pub description: Option<String>,
            pub parent_id: Option<i64>,
        }
    }
}
