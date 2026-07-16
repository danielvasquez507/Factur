import re

with open('src/components/landing/landing-content.tsx', 'r') as f:
    content = f.read()

# Fix className={"accordion-item ... ">
content = re.sub(r'(className=\{"accordion-item [^\}]+?)\">', r'\1"\}>', content)

with open('src/components/landing/landing-content.tsx', 'w') as f:
    f.write(content)
