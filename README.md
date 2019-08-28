The "tagged" fields as defined in bolt11 consist of 3 parts
* `type` (5 bits)
* `data_length` (10 bits, big-endian)
* `data` (data_length x 5 bits)

In the previous section we added `readWords` function to the reader, that did no transformation of any kind, it just simply returned n amount of 5 bit words as defined by the preceeding `data_length` value.

This section will take the n words read and transform them into a human readable format, which is different based on the `type`.  For example, "utf8" will translate to plain readable text while "hex" for payment hash or public key would be a hex string.