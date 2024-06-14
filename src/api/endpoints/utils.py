from models import *

def init_language():
    archive=open("txt_files\\language.txt", "r")
    for language in archive:
        name, name_spanish, script=language.strip().split(';')
        newLanguage=Language(
            name=name,
            name_spanish=name_spanish,
            script=script
        )
        newLanguage.save()