# Stage 1: Build the binary
FROM golang:1.25-alpine AS builder
WORKDIR /app

# Install build dependencies
RUN apk add --no-cache git

# Copy go.mod and go.sum
COPY go.mod go.sum ./
RUN go mod download

# Copy the source code
COPY . .

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -o dnd-api main.go

# Stage 2: Final lightweight image
FROM alpine:latest
WORKDIR /app
RUN apk add --no-cache ca-certificates

# Copy the binary from the builder
COPY --from=builder /app/dnd-api .
# Copy the service account key if it exists
COPY --from=builder /app/serviceAccountKey.json* ./

EXPOSE 8080

CMD ["./dnd-api"]
