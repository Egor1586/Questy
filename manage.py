import Project

def main():
    try:
        # Project.load_env()
        Project.settings.socketio.run(Project.project, host='localhost', port=5000, debug = True)
    except Exception as error:
        print(f'An error: {error}')

if __name__ == "__main__":
    main()