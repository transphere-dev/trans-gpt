import os 
import sys
import io
from lib import findSpeechBubbles
# Initialized as a class attribute

sys.stdout = io.TextIOWrapper(sys.stdout.buffer,encoding='gb18030')

COMIC_DIR_PATH = r"C:\Users\Administrator\Desktop\trans-gpt\server\uploads\comics"
arguments = sys.argv[1:]
print(arguments)

userId = arguments[1]
comic_name =  arguments[3]
filename =  arguments[5]
user_comic_dir = os.path.join(COMIC_DIR_PATH, userId ,comic_name )
contents = os.listdir(user_comic_dir)



for comic_page in contents:
    if os.path.isfile(os.path.join(user_comic_dir, comic_page)):
        comic_page_path = os.path.join(user_comic_dir , comic_page)

        findSpeechBubbles(comic_page_path,'simple',comic_page)
        

