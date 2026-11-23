from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer


class PreviewServer(ThreadingHTTPServer):
    # Chromium opens many parallel chunk connections; Windows needs a larger
    # listen backlog than the standard library default of five.
    request_queue_size = 128


class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        pass


if __name__ == '__main__':
    PreviewServer(('127.0.0.1', 4173), partial(QuietHandler, directory='out')).serve_forever()
