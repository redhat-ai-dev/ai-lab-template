ROOTDIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )" 

# get app templates
$ROOTDIR/scripts/import-ai-app-template
$ROOTDIR/scripts/import-ai-lab-samples