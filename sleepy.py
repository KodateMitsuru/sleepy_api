#!/usr/bin/env python3
import requests
import time
import subprocess
import logging

URL = "https://api.kodatemitsuru.com/api/status"
SECRET = "password"
logging.basicConfig(filename='sleepy_log.txt', level=logging.INFO, format='%(asctime)s - %(message)s')

def get_current_focus():
    result = subprocess.run(['/system/bin/dumpsys', 'activity', 'activities'], stdout=subprocess.PIPE)
    output = result.stdout.decode('utf-8')
    for line in output.splitlines():
        if 'topResumedActivity' in line:
            return line.split()[2].split('/')[0]
    return None

def get_package_path(package_name):
    result = subprocess.run(['cmd', 'package', 'list', 'packages', '-f', package_name], stdout=subprocess.PIPE)
    output = result.stdout.decode('utf-8')
    for line in output.splitlines():
        if package_name == line.split('=')[-1]:
            return line.split(':', 1)[1].rsplit('=', 1)[0]
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
                    data = {
                        "secret": SECRET,
                        "status": package_name
                    }
                    response = session.post(URL, json=data)
                    logging.info(f"Package: {package_name}, Response: {response.status_code} - {response.text}")  # 将响应写入日志文件
        time.sleep(1)

if __name__ == "__main__":
    main()
