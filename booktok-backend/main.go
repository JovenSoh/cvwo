package main

import (
    "github.com/gin-gonic/gin"
	"github.com/gin-contrib/cors"
    "net/http"
    "github.com/jinzhu/gorm"
    _ "github.com/jinzhu/gorm/dialects/postgres"
    "time"
)

type Post struct {
    gorm.Model
    Content       string
    ImageUrl      string `gorm:"column:image_url"`
    Username      string 
    ProfileImageUrl string `gorm:"column:profile_image_url"` 
    Comments      []Comment
}

type Comment struct {
    gorm.Model
    Username      string 
    ProfileImageUrl string `gorm:"column:profile_image_url"` 
    PostID     uint
    Content    string
    Likes      int
    LikedByUser bool
}

func main() {
	router := gin.Default()
    router.Static("/uploads", "./uploads")

    router.Use(cors.New(cors.Config{
        AllowAllOrigins: true,
        AllowMethods:    []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
        AllowHeaders:    []string{"Origin", "Content-Type", "Accept", "Authorization"},
        ExposeHeaders:   []string{"Content-Length"},
        AllowCredentials: true,
        MaxAge: 12 * time.Hour,
    }))

    db, err := gorm.Open("postgres", "host=localhost user=postgres dbname=booktok password=admin sslmode=disable")
    if err != nil {
        panic("Failed to connect to database")
    }
    defer db.Close()

    db.AutoMigrate(&Post{}, &Comment{})

    router.GET("/posts",  func(c *gin.Context) {
        var posts []Post
        db.Preload("Comments").Find(&posts)
    
        // Update ImageUrl to be a full path
        for i := range posts {
            posts[i].ImageUrl = c.Request.Host + "/uploads/" + posts[i].ImageUrl
        }
    
        c.JSON(http.StatusOK, posts)
    })
    

    router.POST("/comments", func(c *gin.Context) {
        var newComment Comment
        if err := c.BindJSON(&newComment); err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
            return
        }

        db.Create(&newComment)
        c.JSON(http.StatusOK, newComment)
    })

    router.POST("/posts", func(c *gin.Context) {
        // Parse multipart form
        if err := c.Request.ParseMultipartForm(32 << 20); err != nil { // 32 MB max memory
            c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid form"})
            return
        }
    
        // Extract text fields
        content := c.PostForm("content")
        username := c.PostForm("username")
    
        // Handle file upload
        file, header, err := c.Request.FormFile("file")
        if err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid file upload"})
            return
        }
        defer file.Close()
    
        // svae the file part is here
        filePath := "./uploads/" + header.Filename
        err = c.SaveUploadedFile(header, filePath)
        if err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file"})
            return
        }
        // create the new post with the uploaded image URL
        newPost := Post{
            Content: content,
            ImageUrl: header.Filename, 
            Username: username,
            ProfileImageUrl: "/images/profile.jpg",
        }
    
        db.Create(&newPost)
        c.JSON(http.StatusOK, newPost)
    })
    

    router.Run() 
}
