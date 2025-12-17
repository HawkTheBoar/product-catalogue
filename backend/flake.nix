{
  description = "Product Catalogue backend";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs =
    {
      self,
      nixpkgs,
      flake-utils,
    }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = import nixpkgs { inherit system; };

        # Change this if your binary name differs
        binaryName = "backend";
      in
      {
        ### Development shell (replacement for your mkShell)
        devShells.default = pkgs.mkShellNoCC {
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
          AXUM_PORT = 3000;
        };

        ### Build the Rust application
        packages.default = pkgs.rustPlatform.buildRustPackage {
          pname = binaryName;
          version = "0.1.0";

          src = ./.;

          cargoLock = {
            lockFile = ./Cargo.lock;
          };

          nativeBuildInputs = with pkgs; [
            pkg-config
          ];

          buildInputs = with pkgs; [
            sqlite
          ];

          # Set runtime env vars
          DATABASE_URL = "sqlite:catalogue.db";
          AXUM_PORT = "3000";
        };

        ### `nix run`
        apps.default = {
          type = "app";
          program = "${self.packages.${system}.default}/bin/${binaryName}";
        };
      }
    );
}
