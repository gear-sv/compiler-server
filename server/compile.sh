emcc $contract_path \
  --bind \
  -Os -s WASM=1 \
  --memoryprofiler \
  -o $id/$contract_name
