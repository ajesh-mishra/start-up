variable "TAG" {
  default = "latest"
}

group "all" {
  targets = ["angular-frontend", "fastapi-backend"]
}

target "angular-frontend" {
  context    = "./angular-frontend"
  dockerfile = "Dockerfile"
  tags       = ["ajeshmishra/startup-angular-frontend:${TAG}"]
  platforms  = ["linux/amd64", "linux/arm64"]
}

target "fastapi-backend" {
  context    = "./fastapi-backend"
  dockerfile = "Dockerfile"
  tags       = ["ajeshmishra/startup-fastapi-backend:${TAG}"]
  platforms  = ["linux/amd64", "linux/arm64"]
}