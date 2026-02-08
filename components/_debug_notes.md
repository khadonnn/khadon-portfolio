Debug notes: Framer Motion overrides CSS `transform` from classes because it
sets an inline `transform` style. To preserve rotate/skew, the rotation/skew
must be applied via framer-motion props (initial/animate) or included in the
inline style framer-motion controls.

Recommended fix performed: moved rotate and skew into `initial` and `animate` so
framer-motion sets them and they are not lost.
