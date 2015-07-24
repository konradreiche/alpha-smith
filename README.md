# Alpha Smith

When working with design and artwork briefs I often find myself in the situation where I need to compute the color equivalent for a given color with certain transparency by applying alpha blending.

While most technologies support to specify an alpha value directly it is often necessary either for backwards compatibility or when it is not possible at all to use the equivalent color directly. Alpha Smith automates this task.

## Development

```
sass --watch src:build
jsx --watch src/ build/
```
