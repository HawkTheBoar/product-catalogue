{
  pkgs ? import <nixpkgs> { },
}:
pkgs.mkShellNoCC {
  name = "catalogue";
  packages = with pkgs; [
    sqlx-cli
    bacon
    cargo
    clippy
    git
    gcc
    rustc
    rust-analyzer
    pkg-config
    sqlite
  ];
  DATABASE_URL = "sqlite:catalogue.db";
}
