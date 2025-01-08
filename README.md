# DevSnap

DevSnap is a developer-focused CLI tool designed to capture and reproduce entire development environments. It allows you to snap your workspace, including project files, dependencies, and configurations, and seamlessly restore them on another device or share them with team members.

## Features

- **Workspace Archiving**: Snap the entire workspace, including files and folder structure, into a compressed archive.
- **Dependency Management**: Capture and restore language-specific dependencies (e.g., Node.js, Python).
- **Configuration Snapshots**: Save and apply environment configurations, such as `.bashrc`, `.gitconfig`, and `.env` files.
- **Cross-Platform Compatibility**: Works across different operating systems while ensuring portability.
- **Exclusion Support**: Use a `.snapignore` file to exclude unnecessary files and directories.

## Installation

Ensure you have Node.js installed on your system.

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/devsnap.git
   cd devsnap
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Link the CLI globally:
   ```bash
   npm link
   ```

## Usage

### Snap Your Workspace

Create a snapshot of your current workspace:
```bash
devsnap snap
```
This command will:
1. Archive the workspace files into a compressed file (e.g., `myproject.tar.gz`).
2. Generate a `devsnap.json` file with dependency and configuration details.

#### Options
- `--directory <path>`: Specify the workspace directory (default: current directory).
- `--output <file>`: Specify the output archive name.

### Restore a Workspace

Restore a previously snapped workspace:
```bash
devsnap restore
```
This command will:
1. Extract the archived workspace files.
2. Reinstall dependencies.
3. Apply saved configurations.

#### Options
- `--archive <file>`: Specify the path to the workspace archive.
- `--target <path>`: Specify the directory to restore the workspace (default: current directory).

### Example Workflow

#### Snap a Workspace
```bash
cd myproject

devsnap snap --directory ./ --output myproject.tar.gz
```

#### Restore the Workspace on Another System
```bash
cd ~/workspaces

devsnap restore --archive ~/downloads/myproject.tar.gz --target ./myproject
```

## Configuration

### `.snapignore`
Define files and directories to exclude from the snapshot:
```
node_modules
.git
.env
```

### `devsnap.json`
A file automatically generated during the `snap` process. Example:
```json
{
  "workspace": {
    "archive": "myproject.tar.gz",
    "exclude": [".git", "node_modules"]
  },
  "dependencies": {
    "node": ["express", "cors"],
    "python": ["flask", "requests"]
  },
  "configs": {
    ".bashrc": "export PATH=$PATH:~/custom/bin",
    ".gitconfig": "[user]\n\tname = John Doe\n\temail = john@example.com"
  }
}
```

## Roadmap

- **Cloud Integration**: Store and share snapshots in the cloud.
- **Team Collaboration**: Support multiple users working on shared environments.
- **GUI Tool**: Build a graphical interface for less technical users.

## Contributing

1. Fork the repository.
2. Create a feature branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add feature description"
   ```
4. Push to your fork and submit a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for details.


