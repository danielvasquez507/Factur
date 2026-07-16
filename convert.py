import re

def to_jsx(html_str):
    # Basic replacements
    html_str = html_str.replace('class="', 'className="')
    html_str = html_str.replace('for="', 'htmlFor="')
    html_str = html_str.replace('onclick="', 'onClick="')
    html_str = html_str.replace('oninput="', 'onChange="')
    
    # SVG attributes to camelCase
    attrs = [
        'stroke-linecap', 'stroke-linejoin', 'stroke-width',
        'fill-rule', 'clip-rule', 'text-anchor', 'font-family',
        'font-size', 'font-weight'
    ]
    for attr in attrs:
        parts = attr.split('-')
        camel = parts[0] + ''.join(x.title() for x in parts[1:])
        html_str = html_str.replace(attr + '="', camel + '="')
        
    # Self-closing tags
    html_str = re.sub(r'<(input[^>]*?)(?<!/)>', r'<\1 />', html_str)
    html_str = re.sub(r'<(img[^>]*?)(?<!/)>', r'<\1 />', html_str)
    html_str = re.sub(r'<br[^>]*?>', r'<br />', html_str)
    html_str = re.sub(r'<(path[^>]*?)(?<!/)>', r'<\1 />', html_str)
    html_str = re.sub(r'<(circle[^>]*?)(?<!/)>', r'<\1 />', html_str)
    
    return html_str

with open('/tmp/landing.html', 'r') as f:
    content = f.read()
    
# Extract body content
body_match = re.search(r'<body[^>]*>(.*?)</body>', content, re.DOTALL | re.IGNORECASE)
if body_match:
    content = body_match.group(1)

# Remove script tags
content = re.sub(r'<script.*?</script>', '', content, flags=re.DOTALL | re.IGNORECASE)

jsx_content = to_jsx(content)

with open('/tmp/landing.jsx', 'w') as f:
    f.write(jsx_content)
    
print("Converted successfully!")
