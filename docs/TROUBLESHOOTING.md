# TROUBLESHOOTING

## MacOS 

Due to differences between Linux and MacOS, the GNU version of `sed` is required to be installed.

```
brew install gnu-sed
```
After this, alter PATH. For example, add the following line to your `~/.bash_profile`:
```
export PATH="/opt/homebrew/opt/gnu-sed/libexec/gnubin:$PATH"
```

## TechDocs Images

If you encounter images within TechDocs not properly rendering on Red Hat Developer Hub you may need to ensure they are located in a sub-directory named `/images` within `/docs`. 

For example: `/docs/images`.

## Using "default" Namespace for AI Software Templates

Note, that as the `"default"` Namespace has specific permissions, choosing this Namespace to deploy your AI Software Templates applications is not supported.
