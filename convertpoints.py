with open("./points") as rf:
    content = rf.read()
    names = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    names = list(names)
    points_by_letter = content.split("#")
    for i, point in enumerate(points_by_letter):
        with open("outPoints/" + names[i], "w+") as wf:
            wf.write(point)
