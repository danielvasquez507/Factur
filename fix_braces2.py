import re

with open('src/components/landing/landing-content.tsx', 'r') as f:
    content = f.read()

# Fix instances where "}> was inserted but there's no opening { in className
def fix_mismatched_braces(match):
    full_string = match.group(0)
    # Check if there's a '{' after className=
    if 'className={"' in full_string or 'className={\'' in full_string or 'className={`' in full_string:
        return full_string
    else:
        # If no opening brace, the closing "} should just be "
        return full_string.replace('"}', '"')

# We can just look for className="... "}
content = re.sub(r'className=\"[^\"]+\"\}', lambda m: m.group(0)[:-1], content)

with open('src/components/landing/landing-content.tsx', 'w') as f:
    f.write(content)
