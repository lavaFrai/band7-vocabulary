zmake .
rm -r .cache/zeppPlayer/projects/*
Copy-Item -Path ./build -Destination ./.cache/zeppPlayer/projects/ -Recurse
