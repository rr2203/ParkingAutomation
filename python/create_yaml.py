import cv2
import numpy as np


# mouse callback function
f=open('points.txt',"a")
list1=[]
c=0
def draw_polygon(event,x,y,flags,param):
    global list1,c
    if event == cv2.EVENT_LBUTTONDOWN:
        list1.append([x,y])
        cv2.circle(img,(x,y),1,(255,0,0),-1)
        if len(list1)==4:
            f.write(str(c)+" : "+str(list1))
            c=c+1
            f.write('\n')
            list1=[]


# Create a black image, a window and bind the function to window
img = cv2.imread('camera123.jpg')
cv2.namedWindow('image')
cv2.setMouseCallback('image',draw_polygon)

while(1):
    cv2.imshow('image',img)
    if cv2.waitKey(1) == ord('q'):
        # print(list1)
        # print(len(list1))
        f.close()
        break
cv2.destroyAllWindows()