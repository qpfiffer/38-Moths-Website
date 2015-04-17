Website and static site generator for the 38-moths website. Uses the same code
as the OlegDB website.

````
git submodule init
git submodule update
./build.py
# Now just scp built/ somewhere.
````

If you want to test locally:

```
cd ./built
ln -s ../static
python2 -m SimpleHTTPServer
```
