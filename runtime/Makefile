.PHONY: install artifacts-install lint test artifacts

install:
	cd build-deps && wget https://github.com/google/protobuf/releases/download/v3.2.0/protoc-3.2.0-linux-x86_64.zip
	cd build-deps && unzip protoc-3.2.0-linux-x86_64.zip
	pipenv install --dev

artifacts-install:
	$(nop)

lint:
	pylint --load-plugins=$(shell pwd)/lints ansible.py runtime.py statemanager.py studentapi.py runtimeUtil.py fakedawn.py hibikesimulator.py

test:
	cd ../DevOps/frankfurter/scripts/update && ./create_update -p
	protoc -I=../ansible-protos --python_out=. ../ansible-protos/*.proto
	python3 runtime.py --test
	python3 runtime.py --test optionalTestsWork

artifacts:
	cp ../DevOps/frankfurter/build/*.tar.gz ../artifacts
