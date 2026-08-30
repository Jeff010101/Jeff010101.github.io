---
title: ''
summary: ''
date: 2022-10-24
type: landing

design:
  spacing: '6rem'

sections:
  - block: resume-biography-3
    content:
      username: me
      text: ''
      button:
        text: 下载简历
        url: https://jeffxing.com/uploads/resume.pdf
      headings:
        about: ''
        education: ''
        interests: ''
    design:
      background:
        gradient_mesh:
          enable: true
      name:
        size: md
      avatar:
        size: medium
        shape: circle
  - block: markdown
    content:
      title: '研究方向'
      subtitle: ''
      text: |-
        I work across two connected layers of intelligent systems:

        * **AI inference:** LLM and multimodal serving, agentic workflows, distributed execution, and performance optimization across heterogeneous hardware.
        * **Visual intelligence:** computer vision, 3D sensing and reconstruction, robotics, ISP/AIISP, and computational photography.

        My goal is to make intelligent systems faster, more capable, and dependable in real-world environments.
    design:
      columns: '1'
  - block: collection
    id: papers
    content:
      title: 论文与专利
      filters:
        folders:
          - publications
        featured_only: false
    design:
      view: citation
---