#!/bin/bash
termux-wake-lock
URL="https://api.kodatemitsuru.com/api/status"
SECRET="password"
while true;do 
    CURRENT_FOCUS=`/system/bin/dumpsys activity activities | grep topResumedActivity`
    if [ ! -z "$CURRENT_FOCUS" ]; then
	#去除多余内容
        CURRENT_FOCUS=$(echo $CURRENT_FOCUS | awk '{print $3}')
        CURRENT_FOCUS=$(echo $CURRENT_FOCUS | awk -F'/' '{print $1}')
        #获取路径
        PACKAGE_PATH=$(cmd package list packages -f $CURRENT_FOCUS | grep -E "$CURRENT_FOCUS$")
	#去除多余内容
        PACKAGE_PATH=${PACKAGE_PATH#*:}
        PACKAGE_PATH=${PACKAGE_PATH%=*}
        PACKAGE_NAME=$(aapt dump badging $PACKAGE_PATH | grep application-label-zh-CN)
        if [ -z "$PACKAGE_NAME" ]; then
            PACKAGE_NAME=$(aapt dump badging $PACKAGE_PATH | grep application-label)
        fi
        PACKAGE_NAME=${PACKAGE_NAME#*\'}
        PACKAGE_NAME=${PACKAGE_NAME%\'*}
        # 输出一下PACKAGE_NAME
        echo "$PACKAGE_NAME"
        curl -X POST "$URL?secret=$SECRET&status=$PACKAGE_NAME"
    fi
    sleep 1
done
