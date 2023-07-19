import os 
import sys
import io
from lib import findSpeechBubbles
import json
# Initialized as a class attribute

sys.stdout = io.TextIOWrapper(sys.stdout.buffer,encoding='gb18030')

server_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

COMIC_DIR_PATH = os.path.join(server_dir, 'uploads', 'comics')
arguments = sys.argv[1:]
userId = arguments[1]
comic_name =  arguments[3]
filename =  arguments[5]
user_comic_dir = os.path.join(COMIC_DIR_PATH, userId ,comic_name )
contents = os.listdir(user_comic_dir)



def comic_page_looper():
    
    full_comic_texts = []
    for comic_page in contents:
        if os.path.isfile(os.path.join(user_comic_dir, comic_page)):
            comic_page_path = os.path.join(user_comic_dir , comic_page)
            """
            This function crops the dialog boxes of each page,
            extracts the text of each cropped dialog box from the same page

            """
            page_texts = findSpeechBubbles(comic_page_path,'simple',comic_page)
            # full_comic_texts.append(page_texts)
            full_comic_texts += page_texts
    print(json.dumps({"comic": full_comic_texts}))        
            
    return full_comic_texts

comic_page_looper()
# f = open('result.json','a')
# f.write(json.dumps({"comic": full_comic_texts}))
# f.close()
