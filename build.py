#!/usr/bin/env python2

from greshunkel.build import main
from greshunkel.context import BASE_CONTEXT, build_doc_context

if __name__ == '__main__':
    context = build_doc_context(BASE_CONTEXT)
    main(context)
