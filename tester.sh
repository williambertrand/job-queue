urlArray=("google.com" "facebook.com" "github.com" "apple.com" "news.ycombinator.com")

for url in "${urlArray[@]}"
do 
    curl -H "Content-Type: application/json" -X POST -d '{"url":"'"$url"'"}' http://localhost:3000/jobs
done
