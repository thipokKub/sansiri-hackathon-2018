# pip3 install face_recognition
import os
from os.path import join
import face_recognition

def get_similarity(path_to_all_pics, path_to_pic):
	result = []
	known_encodings = []

	pic = face_recognition.load_image_file(path_to_pic)
	encoded_pic = face_recognition.face_encodings(pic)[0]
	
	all_pics = [f for f in os.listdir(path_to_all_pics) if '.jpg' in f]

	for pic in all_pics:
		base_img = face_recognition.load_image_file(join(path_to_all_pics, pic))
		base_encoded_img = face_recognition.face_encodings(base_img)[0]
		known_encodings.append(base_encoded_img)
	face_distances = face_recognition.face_distance(known_encodings, encoded_pic)

	for i in range(len(known_encodings)):
		result.append((all_pics[i], face_distances[i]))
	result = sorted(result, key=lambda tup: tup[1])

	return result

def get_possible_img(path_to_all_pics, path_to_pic):
	result = []
	sim = get_similarity(path_to_all_pics, path_to_pic)
	for pic in sim:
		if pic[1] < 0.4:
			result.append(pic[0])
	return result

# Test
path_to_all_pics = '/Users/pongpisit/Desktop/ysetter/pics'
test_pics = [p for p in os.listdir('/Users/pongpisit/Desktop/ysetter/test_pics') if '.jpg' in p]
print(test_pics)

for pic in test_pics:
	print(get_possible_img(path_to_all_pics, join('/Users/pongpisit/Desktop/ysetter/test_pics', pic)))