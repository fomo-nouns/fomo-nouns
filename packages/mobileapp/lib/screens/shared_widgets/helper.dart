import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

/// Widget that help to correctly show elements that require
/// Material parent widget on iOS.
class MaterialWidget extends StatelessWidget {
  const MaterialWidget({Key? key, required this.child}) : super(key: key);

  final Widget child;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.transparent,
      child: child,
    );
  }
}

/// Widget that add on left and right.
class SidePadding extends StatelessWidget {
  const SidePadding({Key? key, required this.child}) : super(key: key);

  final Widget child;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.symmetric(
        horizontal: 30.w,
      ),
      child: child,
    );
  }
}
