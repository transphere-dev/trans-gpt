from PIL import Image
from paddleocr import PaddleOCR,draw_ocr
import sys
from lib import findSpeechBubbles
import os
import io





class Extractor:
    """
    img_pa
    """
    ocr = PaddleOCR(use_angle_cls=True, lang='ch')  # Initialized as a class attribute

    def __init__(self, img_path, lang) -> None:
        self.img_path = img_path
        self.lang = lang
        self.result = self.ocr.ocr(self.img_path, cls=True)

    def extractTextPaddle(self):
        txts = [line[1][0] for line in self.result[0]]
        sentence = ''.join(txts)
        print(sentence)
        return sentence

    def drawRect(self):
        result = self.result[0]
        image = Image.open(self.img_path).convert('RGB')
        boxes = [line[0] for line in result]
        txts = [line[1][0] for line in result]
        scores = [line[1][1] for line in result]
        im_show = draw_ocr(image, boxes)
        im_show = Image.fromarray(im_show)
        im_show.save('result.jpg')


