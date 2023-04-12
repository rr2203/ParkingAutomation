# VEELOX: Intelligent Parking Automation

Contributors: @rr2203, @vishnoitanuj, @bpahuja, @parvagarwal

Algorithm for parking detection using computer vision with OPENCV. We detect parking lot contours and perform motion detection to determine parking spot status. Then we update the parking spot status in real-time on Firebase and ddisplaya live video feed with the parking spot status overlaid on the frames. It saves the output video, if specified.

We use Python 3.5.6 with OpenCv to work on it.

The YAML library was used.

To install use: 

pip install pyyaml

The main code is in python/parking.py

You can place parking limits on datasets/new.yml
