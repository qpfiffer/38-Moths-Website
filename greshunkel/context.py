from greshunkel.build import POSTS_DIR
from greshunkel.utils import parse_variable
from greshunkel.slimdown import Slimdown

from os import listdir, walk
import subprocess, re

INCLUDE_DIR = "./38-Moths/include/"
DOCUMENTATION_DIR = "./38-Moths/docs/"
DEFAULT_LANGUAGE = "en"
# Question: Hey qpfiffer, why is this indented all weird?
# Man I don't know leave me alone.
BASE_CONTEXT = {}

# Fuck doing anything intelligent in the templating framework:
#BASE_CONTEXT["FIRST_DOWNLOAD"] = [BASE_CONTEXT["ALL_DOWNLOADS"][0]]

def build_blog_context(default_context):
    default_context['POSTS'] = []

    slimmin = Slimdown()
    for post in listdir(POSTS_DIR):
        if not post.endswith(".markdown"):
            continue

        new_post = {}
        dashes_seen = 0
        reading_meta = True
        muh_file = open(POSTS_DIR + post)
        all_text = ""
        for line in muh_file:
            stripped = line.strip()
            if stripped == '---':
                dashes_seen += 1
                if reading_meta and dashes_seen < 2:
                    continue
            elif reading_meta and dashes_seen >= 2:
                reading_meta = False
                continue

            if reading_meta and ':' in line:
                split_line = stripped.split(":")
                new_post[split_line[0]] = split_line[1]

            if not reading_meta:
                all_text += line

        new_post['content'] = slimmin.render(all_text)
        new_post['preview'] = new_post['content'][:300] + "&hellip;"
        new_post['link'] = "blog/{}".format(post.replace("markdown", "html"))
        new_post['filename'] = post
        new_post['built_filename'] = post.replace("markdown", "html")
        default_context['POSTS'].append(new_post)
        muh_file.close()
    default_context['POSTS'] = sorted(default_context['POSTS'], key=lambda x: x["date"], reverse=True)
    return default_context

def try_to_build_documentation_tree(default_context):
    root = []

    # Murderous material, made by a madman
    # It's the mic wrecker, Inspector, bad man
    # Wu-Tang Clan, 7th Chamber.
    def _build_tree(directory):
        only_name = directory.split("/")[-1]
        to_return = {
            "children": [],
            "name": only_name,
            "body": "",
            "nav": ""
        }

        for _, dirs, files in walk(directory):
            for dir_name in dirs:
                to_return["children"].append(_build_tree(directory + "/" + dir_name))

            for file_name in sorted(files):
                if not file_name.endswith(".markdown"):
                    continue
                subsection_name = re.compile(r'[a-zA-Z][a-zA-Z0-9_]*')
                thing = subsection_name.search(file_name)
                slug = thing.group().lower()
                name = thing.group().replace("_", " ")
                rendered_section_name = \
                    '<h2 class="perma" id="{slug}">{name} <a href="#{slug}">&para;</a></h2>'.format(
                        slug=slug, name=name)

                opened = open(directory + "/" + file_name)
                all_text = opened.read()

                slimmin = Slimdown()
                to_return["body"] = ''.join([to_return["body"], rendered_section_name, slimmin.render(all_text)])
                to_return["nav"] = ''.join([to_return["nav"], '<li><a href="#{slug}">{name}</a></li>'.format(slug=slug, name=name)])
                opened.close()

        # Build the thing for the main section
        slug = only_name.lower().replace(" ", "_")
        name = only_name.replace("_", " ")
        rendered_section_name = \
            '<h2 class="perma" id="{slug}">{name} <a href="#{slug}">&para;</a></h2>'.format(
                slug=slug, name=name)
        to_return["body"] = ''.join(['<div class="doc_chunk">', rendered_section_name, to_return["body"], "</div>"])
        master_nav = '<a href="#{slug}">{name}</a>'.format(slug=only_name.lower().replace(" ", "_"), name=only_name)
        to_return["nav"] = "<li>{master_nav}<ul>{nav}</ul></li>".format(master_nav=master_nav, nav=to_return["nav"])

        return to_return

    for _, dirs, _ in walk(DOCUMENTATION_DIR):
        for x in dirs:
            root.append(_build_tree(DOCUMENTATION_DIR + x))

    return root

def build_doc_context(default_context):
    output = subprocess.check_output("cd 38-Moths && git tag --list", shell=True)
    default_context['docs'] = {}
    default_context['ALL_VERSIONS'] = []
    versions = sorted(output.strip().split("\n"))
    versions.append("master")

    for version in versions:
        print "Checking out {}".format(version)
        cmd = "cd 38-Moths && git checkout {} &> /dev/null".format(version)
        subprocess.check_output(cmd, shell=True)
        headers = ["38-moths.h", "server.h", "grengine.h", "greshunkel.h", "utils.h", "vector.h"]
        headers = map(lambda x: "{}/{}".format(INCLUDE_DIR, x), headers)
        version_context = {}
        for header_file in headers:
            try:
                oleg_header = open(header_file)
            except IOError as e:
                print e
                continue

            docstring_special = ["DEFINE", "ENUM", "STRUCT", "DESCRIPTION",
                    "RETURNS", "TYPEDEF"]

            reading_docs = False
            raw_code = ""
            doc_object = {}

            for line in oleg_header:
                docline = False
                stripped = line.strip()
                if stripped == '*/':
                    continue

                # ThIs iS sOmE wEiRd FaLlThRouGh BuLlShIt
                if reading_docs and stripped.startswith("/*"):
                    raise Exception("Yo I think you messed up your formatting. Read too far.")
                if "xXx" in line and "*" in stripped[:2]:
                    (variable, value) = parse_variable(stripped)

                    docline = True
                    if not reading_docs:
                        doc_object["name"] = value
                        doc_object["type"] = variable
                        doc_object["params"] = []
                        reading_docs = True
                    else:
                        if variable in docstring_special:
                            # SpEcIaL
                            doc_object[variable] = value
                        else:
                            doc_object["params"].append((variable, value))
                if reading_docs and not docline and stripped != "":
                    raw_code = raw_code + line
                if stripped == "" and reading_docs:
                    reading_docs = False
                    doc_object["raw_code"] = raw_code
                    if version_context.get(doc_object["type"], False):
                        version_context[doc_object["type"]].append(doc_object)
                    else:
                        version_context[doc_object["type"]] = [doc_object]
                    doc_object = {}
                    raw_code = ""

            oleg_header.close()

        version_raw_code = [x for x in version_context['DEFINE'] if x['name'] == 'VERSION'][0]['raw_code']
        extracted_version = version_raw_code.split(' ')[2].strip()
        extracted_version = extracted_version.replace('"', '')
        if version == 'master':
            default_context['EXTRACTED_VERSION'] = extracted_version
        default_context['docs'][extracted_version] = version_context
        default_context['ALL_VERSIONS'].append(extracted_version)
        handwritten = try_to_build_documentation_tree(default_context)
        default_context["docs"][extracted_version]["DEFAULT_DOCUMENTATION"] = handwritten

    return default_context
