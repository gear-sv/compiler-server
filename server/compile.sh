emcc $contract_path \
  --bind \
  -Os -s WASM=1 \
  -o $id/$contract_name
