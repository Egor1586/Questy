import Project

def main():
    try:
        # Project.load_env()
        Project.settings.project.run(debug= True)
        # Project.settings.socketio.run(Project.project, host='0.0.0.0', port=5000, debug = True)
    except Exception as error:
        print(f'An error: {error}')

if __name__ == "__main__":
    main()