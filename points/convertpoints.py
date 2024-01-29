# from https://shinao.github.io/PathToPoints/

with open("./pointsAll") as rf:
    content = rf.read().strip()
    names = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    names = list(names)
    points_by_letter = content.split("#")[:-1]
    for i, point in enumerate(points_by_letter):
        with open("./pointsFromSVG/" + names[i], "w+") as wf:
            wf.write(point)
