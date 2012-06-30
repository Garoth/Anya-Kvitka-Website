less:
	lessc css/main.less > css/main.css

release: less
	rm -Rf BUILD
	mkdir -p BUILD
	cp -R *.html css js img BUILD
	find BUILD -name "*.less" -delete
	find BUILD -name ".DS_Store" -delete
	find BUILD -name "*.swp" -delete
	find BUILD -type d -empty -delete
	rm -Rf BUILD/img/sources

all: less
