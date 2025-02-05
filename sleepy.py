#!/usr/bin/env python3
import os
import requests
import time
import subprocess
import logging

URL = "https://api.kodatemitsuru.com/api/status"
SECRET = "password"

cache_dir = os.path.join(os.path.expanduser('~'), '.cache', 'sleepy')
os.makedirs(cache_dir, exist_ok=True)
log_file_path = os.path.join(cache_dir, 'sleepy_log.txt')
log_handler = logging.handlers(
    log_file_path,
    when='midnight',  # 每天午夜轮转日志
    interval=1,  # 间隔1天
    backupCount=7  # 保留7天的日志文件
)
log_handler.setLevel(logging.INFO)
log_handler.setFormatter(logging.Formatter('%(asctime)s - %(message)s'))

logger = logging.getLogger()
logger.setLevel(logging.INFO)
logger.addHandler(log_handler)

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
    name = None
    for line in output.splitlines():
        if 'application-label-zh-CN' in line:
            name = line.split("'")[1]
        elif 'application-label' in line and not name:
            name = line.split("'")[1]
    return name

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
                    if response.text:
                        logger.info(f"Package: {package_name}, Response: {response.status_code} - {response.text}")
                    else:
                        logger.info(f"Package: {package_name}, Response: {response.status_code}")
        time.sleep(1)

if __name__ == "__main__":
    main()
