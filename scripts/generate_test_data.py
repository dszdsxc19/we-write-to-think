import os

base_dir = "data/blog/en/series-test"
os.makedirs(base_dir, exist_ok=True)

for i in range(1, 21):
    content = f"""---
title: Series Test Part {i}
date: '2023-01-{i:02d}'
tags: ['test', 'series']
draft: false
summary: This is part {i} of the large test series.
series: 'Large Test Series'
step: {i}
---

# Part {i}

Content for part {i}.
"""
    with open(f"{base_dir}/part-{i}.mdx", "w") as f:
        f.write(content)

print("Created 20 test posts.")
