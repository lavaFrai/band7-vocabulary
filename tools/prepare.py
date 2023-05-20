import json
import csv
import os
import shutil


data = json.load(open("../raw/raw.json"))
alphabet = json.load(open('../oldAssets/data/alphabet.json', encoding="utf8"))
# muller = csv.reader(open("raw/muellerdict_words.csv", encoding="utf8"))
global mxInOne, mxPath
mxPath = ""
mxInOne = 0


def genRecurse(offset, path):
    """
    if offset >= 2: 
        if os.path.exists(path + "/it.json"):
            os.remove(path + "/it.json")
        os.rename(path + "/raw.json", path + "/it.json")
        data = json.load(open(path + "/it.json"))
        json.dump({}, open(path + "/count.json", 'w'))

        global mxInOne, mxPath
        if len(data) > mxInOne:
            mxPath = path
            mxInOne = max(mxInOne, len(data))
        return
"""
    alphabet = json.load(open('../oldAssets/data/alphabet.json', encoding="utf8"))
    data = json.load(open(path + "/raw.json"))
    count = {}

    if len(data) < 80:
        if os.path.exists(path + "/it.json"):
            os.remove(path + "/it.json")
        os.rename(path + "/raw.json", path + "/it.json")
        json.dump({}, open(path + "/count.json", 'w'))
        return

    shortData = list(filter(lambda x: len(x['en']) == offset, data))
    data = list(filter(lambda x: len(x['en']) > offset, data))

    for i in alphabet:
        count[i.lower()] = len(list(filter(lambda x : x["en"][offset] == i.lower(), data)))
    json.dump(count, open(path + "/count.json", "w"), ensure_ascii=False)
    json.dump(shortData, open(path + "/it.json", "w"), ensure_ascii=False)


    for key in count.keys():
        if count[key] > 0:
            if not os.path.exists(path + "/" + key.lower()):
                os.makedirs(path + "/" + key.lower())
            words = list(filter(lambda x : x["en"][offset] == key.lower(), data))
            words = list(sorted(words, key=lambda x: x["en"]))
            json.dump(words, open(path + "/" + key.lower() + "/raw.json", "w"), ensure_ascii=False)
            genRecurse(offset+1, path + "/" + key)

            


print("Preparing...")
if not os.path.exists("../raw/ENG-RU/"):
    os.makedirs("../raw/ENG-RU/")


count = {}
for i in alphabet:
    # print(data[0])
    count[i.lower()] = len(list(filter(lambda x : x["en"].startswith(i.lower()), data)))

json.dump(count, open("../raw/ENG-RU/count.json", "w"), ensure_ascii=False)


for i in alphabet:
    # print(data[0])
    words = list(filter(lambda x : x["en"].startswith(i.lower()), data))
    for j in range(len(words)):
        words[j]["ru"] = words[j]["ru"].split(", ")
        words[j]["ru"] = list(map(lambda x: x.replace(" (TR!)", ""), words[j]["ru"]))

    count[i.lower()] = len(words)

    if not os.path.exists("../raw/ENG-RU/" + i.lower()):
        os.makedirs("../raw/ENG-RU/" + i.lower())

    json.dump(words, open("../raw/ENG-RU/" + i.lower() + "/raw.json", "w"), ensure_ascii=False)
    genRecurse(1, "../raw/ENG-RU/" + i.lower())

"""
allRusians = []
for element in data:
    for word in element["ru"].split(", "):
        allRusians.append(
            word
            .replace(" (TR!)", "")
            )

print(len(sorted(list(set(allRusians)))))
"""

# print(mxInOne, mxPath)
print("Packing...")
import gen
print("Removing...")
shutil.rmtree("../raw/ENG-RU")
print("Ready")
