# Generated by Django 5.1.1 on 2024-10-16 08:28

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("Authentication", "0003_alter_customuser_email_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="customuser",
            name="email",
            field=models.EmailField(blank=True, max_length=254, null=True),
        ),
    ]
