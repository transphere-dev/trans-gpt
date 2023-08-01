from json import encoder
import cv2
import numpy as np
from matplotlib import pyplot as plt
import os
import csv
from PIL import Image
from paddleocr import PaddleOCR,draw_ocr
import json
import base64

ocr = PaddleOCR(use_angle_cls=True, lang='ch',show_log=False)  
# find all speech bubbles in the given comic page and return a list of cropped speech bubbles (with possible false positives)
def findSpeechBubbles(imagePath, method, filename):
    cropped_comic_dir = os.path.dirname(os.path.join(imagePath,'dialog'))
    parent_dir = os.path.abspath(os.path.join(cropped_comic_dir, os.pardir)) # Change the current working directory to the parent directory 
    croped_dir = os.path.join(parent_dir,'dialog')
    fn = filename.split('.')[0]
    try:
        os.mkdir(os.path.join(croped_dir,fn))
    except:
        # print("Could not create cropped photo directory")
        pass
    # read image
    image = cv2.imread(imagePath)
    # gray scale
    imageGray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    # filter noise
    imageGrayBlur = cv2.GaussianBlur(imageGray, (3, 3), 0)
    if method != 'simple':
        # recognizes more complex bubble shapes
        imageGrayBlurCanny = cv2.Canny(imageGrayBlur, 50, 500)
        binary = cv2.threshold(imageGrayBlurCanny, 235,
                               255, cv2.THRESH_BINARY)[1]
    else:
        # recognizes only rectangular bubbles
        binary = cv2.threshold(imageGrayBlur, 235, 255, cv2.THRESH_BINARY)[1]

    # find contours
    contours = cv2.findContours(
    binary, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)[0]

    # get the list of cropped speech bubbles

    croppedImageList = []
    textList = []
    id = 0
    for contour in contours:

        contour = contour.astype(np.int32)
        rect = cv2.boundingRect(contour)

        # cv2.drawContours(image, [contour], 0, (0, 0, 255), 2)

        [x, y, w, h] = rect

        # filter out speech bubble candidates with unreasonable size
        if w < 700 and w > 60 and h < 300 and h > 30:
            cv2.rectangle(image, (x, y), (x + w, y + h), (0, 255, 0), 2)
            croppedImage = image[y:y+h, x:x+w]

            path = os.path.join(croped_dir,fn, str(id)+'-'+str(filename))

            cv2.imwrite(path, croppedImage)
            result = ocr.ocr(path, cls=True)
            txts = [line[1][0] for line in result[0]]
            sentence = ''.join(txts)

            if sentence != "":
                textList.append(dict({
                    "_id":id,
                    "source":sentence,
                    "page":fn,
                    "image_path":os.path.relpath(path).replace('\\','/'),
                    "dialog_box": True
                }))


            id += 1

    return textList

