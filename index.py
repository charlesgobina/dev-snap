"""Devsnap MVP"""
import os
import sys
import json
import shutil
import hashlib
import tarfile
from pathlib import Path
import podman
from datetime import datetime
import podman.client
from rich.console import Console
from rich.progress import Progress


class DevSnap:
    def __init__(self):
        self.console = Console()
        self.podman_client = podman.client()
        self.config_dir = Path.home() / '.devsnap'
        self.config_dir.mkdir(exist_ok=True)

    def create_snapshot(self, project_path: str, name: str):
        """Create a snapshot of the development environment"""
        project_path = Path(project_path)

        with Progress() as progress:
            task = progress.add_task("[green]Creating snapshot...", total=100)

            # 1. Create project hash for uniqueness
            project_hash = self._hash_directory(project_path)
            progress.update(task, advance=20)

            # 2. Create container image using buildah (part of podman)
            container_image = self._create_container_image(project_path)
            progress.update(task, advance=40)

            # 3. Save snapshot metadata
            snapshot_info = {
                'name': name,
                'project_hash': project_hash,
                'created_at': str(datetime.now()),
                'image_id': container_image.id
            }

            snapshot_path = self.config_dir / f"{name}.snap"
            with snapshot_path.open('w') as f:
                json.dump(snapshot_info, f)
            progress.update(task, advance=20)

            # 4. Export container image
            image_path = self.config_dir / f"{name}.tar"
            container_image.save(str(image_path))
            progress.update(task, advance=20)

        self.console.print(f"\n✨ Snapshot '{name}' created successfully!")

    def restore_snapshot(self, name: str, target_path: str):
        """Restore a development environment from a snapshot"""
        snapshot_path = self.config_dir / f"{name}.snap"
        image_path = self.config_dir / f"{name}.tar"

        if not snapshot_path.exists():
            raise ValueError(f"Snapshot '{name}' not found")

        with Progress() as progress:
            task = progress.add_task("[green]Restoring snapshot...", total=100)

            # 1. Load snapshot metadata
            with snapshot_path.open('r') as f:
                snapshot_info = json.load(f)
            progress.update(task, advance=20)

            # 2. Load container image
            image = self.podman_client.images.load(str(image_path))[0]
            progress.update(task, advance=40)

            # 3. Create container and extract files
            container = self.podman_client.containers.create(image)
            try:
                container.export(target_path)
            finally:
                container.remove()
            progress.update(task, advance=40)

        self.console.print(f"\n✨ Snapshot '{name}' restored successfully!")

    def _hash_directory(self, path: Path) -> str:
        """Create a hash of directory contents"""
        sha256_hash = hashlib.sha256()

        for filepath in sorted(path.rglob('*')):
            if filepath.is_file():
                with filepath.open("rb") as f:
                    for byte_block in iter(lambda: f.read(4096), b""):
                        sha256_hash.update(byte_block)

        return sha256_hash.hexdigest()

    def _create_container_image(self, project_path: Path):
        """Create a container image from project directory"""
        # Create temporary Containerfile
        dockerfile_content = f"""
        FROM scratch
        COPY . /project
        """

        temp_dir = Path('/tmp/devsnap')
        temp_dir.mkdir(exist_ok=True)

        dockerfile = temp_dir / 'Containerfile'
        dockerfile.write_text(dockerfile_content)

        try:
            # Build image using podman
            image = self.podman_client.images.build(
                path=str(project_path),
                dockerfile=str(dockerfile),
                tag='devsnap-temp'
            )
            return image
        finally:
            shutil.rmtree(temp_dir)


def main():
    devsnap = DevSnap()

    if len(sys.argv) < 2:
        print("Usage: devsnap [create|restore] [name] [path]")
        sys.exit(1)

    command = sys.argv[1]

    if command == 'create':
        if len(sys.argv) != 3:
            print("Usage: devsnap create [name]")
            sys.exit(1)
        devsnap.create_snapshot(os.getcwd(), sys.argv[2])

    elif command == 'restore':
        if len(sys.argv) != 4:
            print("Usage: devsnap restore [name] [target_path]")
            sys.exit(1)
        devsnap.restore_snapshot(sys.argv[2], sys.argv[3])


if __name__ == "__main__":
    main()
