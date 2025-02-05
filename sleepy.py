#! env python3
import requests
import time
import subprocess

URL = "https://api.kodatemitsuru.com/api/status"
SECRET = "password"

def get_current_focus():
    result = subprocess.run(['/system/bin/dumpsys', 'activity', 'activities'], stdout=subprocess.PIPE)
    output = result.stdout.decode('utf-8')
    for line in output.splitlines():
        if 'topResumedActivity' in line:
            return line.split()[3].split('/')[0]
    return None

def get_package_path(package_name):
    result = subprocess.run(['cmd', 'package', 'list', 'packages', '-f', package_name], stdout=subprocess.PIPE)
    output = result.stdout.decode('utf-8')
    for line in output.splitlines():
        if package_name in line:
            return line.split('=')[0].split(':')[1]
    return None

def get_package_name(package_path):
    result = subprocess.run(['aapt', 'dump', 'badging', package_path], stdout=subprocess.PIPE)
    output = result.stdout.decode('utf-8')
    for line in output.splitlines():
        if 'application-label-zh-CN' in line:
            return line.split("'")[1]
        if 'application-label' in line:
            return line.split("'")[1]
    return None

def main():
    session = requests.Session()
    while True:
        current_focus = get_current_focus()
        if current_focus:
            package_path = get_package_path(current_focus)
            if package_path:
                package_name = get_package_name(package_path)
                if package_name:
                    print(package_name)
                    data = {
                        "secret": SECRET,
                        "package": package_name
                    }
                    response = session.post(URL, json=data)
                    print(response.status_code, response.text)
        time.sleep(1)

if __name__ == "__main__":
    main()
