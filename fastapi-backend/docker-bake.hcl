group "default" {
  targets = ["fastapi"]
}

variable "TAG" {
  default = "latest"
}

target "fastapi" {
  context = "."
  dockerfile = "Dockerfile"

  tags = [
    "fastapi-backend:0.0.1:0.0.1",
    "fastapi-backend:0.0.1:${TAG}"
  ]

  platforms = [
    "linux/amd64",
    "linux/arm64"
  ]
}
